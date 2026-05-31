export interface CarbonInputs {
  electricity: number; // kWh / month
  fuel: number; // L / month
  travel: number; // km / month
}

export interface CarbonResult {
  electricity_emissions: number;
  fuel_emissions: number;
  travel_emissions: number;
  total_emissions: number; // kg CO2 / month
  eco_score: number; // 0-100
  sustainability_rating: "High Impact" | "Moderate" | "Good" | "Excellent";
  annual_projection: number; // kg CO2 / year
  trees_needed: number;
  earths_needed: number;
}

const ELECTRICITY_FACTOR = 0.85;
const FUEL_FACTOR = 2.31;
const TRAVEL_FACTOR = 0.19;

// Reference: 21 kg CO2 absorbed per tree per year
const KG_PER_TREE_YEAR = 21;
// Sustainable per-capita budget ~ 2000 kg/year per person
const SUSTAINABLE_ANNUAL_BUDGET = 2000;

export function calculateCarbon(inputs: CarbonInputs): CarbonResult {
  const electricity_emissions = +(inputs.electricity * ELECTRICITY_FACTOR).toFixed(2);
  const fuel_emissions = +(inputs.fuel * FUEL_FACTOR).toFixed(2);
  const travel_emissions = +(inputs.travel * TRAVEL_FACTOR).toFixed(2);
  const total_emissions = +(electricity_emissions + fuel_emissions + travel_emissions).toFixed(2);
  const annual_projection = +(total_emissions * 12).toFixed(2);

  // Eco score: 100 at 0 emissions, 0 at >= 1000 kg/month
  const eco_score = Math.max(0, Math.min(100, Math.round(100 - (total_emissions / 1000) * 100)));

  let sustainability_rating: CarbonResult["sustainability_rating"] = "Moderate";
  if (eco_score >= 81) sustainability_rating = "Excellent";
  else if (eco_score >= 61) sustainability_rating = "Good";
  else if (eco_score >= 31) sustainability_rating = "Moderate";
  else sustainability_rating = "High Impact";

  const trees_needed = +Math.max(0, annual_projection / KG_PER_TREE_YEAR).toFixed(1);
  const earths_needed = +Math.max(0.1, annual_projection / SUSTAINABLE_ANNUAL_BUDGET).toFixed(2);

  return {
    electricity_emissions,
    fuel_emissions,
    travel_emissions,
    total_emissions,
    eco_score,
    sustainability_rating,
    annual_projection,
    trees_needed,
    earths_needed,
  };
}

export function ratingColor(rating: CarbonResult["sustainability_rating"]): string {
  switch (rating) {
    case "Excellent": return "text-emerald-500";
    case "Good": return "text-teal-500";
    case "Moderate": return "text-amber-500";
    case "High Impact": return "text-red-500";
  }
}

export function getPlans() {
  return JSON.parse(localStorage.getItem("timewise_plans")) || [];
}

export function savePlans(plans) {
  localStorage.setItem("timewise_plans", JSON.stringify(plans));
}
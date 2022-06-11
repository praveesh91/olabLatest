export const sortPlans = (list: any, orderBy: string) => {
  if (orderBy === "asc") {
    let sorted = list.sort((prev: any, next: any) => {
      return prev.monthly_orders > next.monthly_orders ? 1 : -1;
    });
    return sorted;
  }

  if (orderBy === "desc") {
    let sorted = list.sort((prev: any, next: any) => {
      return prev.monthly_orders < next.monthly_orders ? 1 : -1;
    });
    return sorted;
  }

  return list;
};

export const sortListBy = (list: any, key: string, orderBy: string) => {
  if (orderBy === "asc") {
    let sorted = list.sort((prev: any, next: any) => {
      return prev[key] > next[key] ? 1 : -1;
    });
    return sorted;
  }

  if (orderBy === "desc") {
    let sorted = list.sort((prev: any, next: any) => {
      return prev[key] < next[key] ? 1 : -1;
    });
    return sorted;
  }
  return list;
};


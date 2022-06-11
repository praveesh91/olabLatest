const localStore = {
  get: (key: string) => {
    let value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key:string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};

export default localStore;

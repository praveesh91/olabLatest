export const jsLoader = (libUrl: string, id: string, multi:boolean = false) => {
  const ele = document.getElementById(id);
  if (!multi && ele) {
    return;
  }
  const script = document.createElement("script");
  script.src = libUrl;
  script.async = true;
  script.id = id;
  document.body.appendChild(script);
};

export default jsLoader;

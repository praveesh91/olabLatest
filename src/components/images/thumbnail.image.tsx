const ThumbnailImage = ({
  path,
  size = "md",
  fitSize = true,
  altSize = "md"
}: {
  path: string;
  size?: string;
  fitSize?: boolean;
  altSize?: string;
}) => {
  return (
    <div className={`thumbnail-frame thumbnail-frame-default-${altSize} ${"thumbnail-frame-" + size}`}>
      {path && <img src={path} className={`${fitSize ? "img-fit-aspect-ration" : ""}`} alt="" />}
    </div>
  );
};

export default ThumbnailImage;

import Image from "next/image";
import config from "../../config.json";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;

  // 其他可能的图片属性
};

type CustomImageProps = ImageProps & {
  // 使用 Rest 参数定义剩余属性
  // 这将允许接受任何剩余属性
  // 注意：这里使用 Record<string, any> 是为了接受任何键和任何值的属性
  rest?: Record<string, any>;
};

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width = 800,
  height = 450,
  style,
  onClick,
  ...rest
}) => {
  // 检查是否属于特定的远程模式，可以根据需要扩展
  const isConfiged = checkUrlIsConfiged(src);

  if (isConfiged) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        onClick={onClick}
        {...rest} // 将剩余属性传递给 Image 组件
      />
    );
  } else {
    // 如果不是远程图片，使用普通的 <img> 元素
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        onClick={onClick}
        {...rest}
      />
    );
  }
};

export default CustomImage;

function checkUrlIsConfiged(src: string): boolean {
  const hosts = config.ImageCDNs;
  return hosts.some((host) => src.startsWith(host.hostname));
}

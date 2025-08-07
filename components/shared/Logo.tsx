import Image from "next/image";

interface LogoProps {
  expanded?: boolean;
  height: number;
  width: number;
}

const Logo: React.FC<LogoProps> = ({ expanded = true, height, width }) => {
  return (
    <div
      style={{ height: `${expanded ? "36" : "40"}px` }}
      className="text-primary text-lg font-bold text-center"
    >
      <Image
        height={height}
        width={90}
        src={
           "/assets/images/logo-text.png"
         
        }
        alt="Mikrosell Image Studio Logo"
        className={`w-${width}`}
      />
    </div>
  );
};

export default Logo;

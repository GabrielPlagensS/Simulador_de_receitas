type ButtonProps = {
  title: string;
  variant: "default";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ title, variant = "default", ...props }: ButtonProps) => {
  const defaultStyle =
    "w-87.5 cursor-pointer rounded-md bg-[#1163C8]  hover:bg-[#FF7F00] py-1 text-sm font-bold text-white";

  return (
    <button {...props} className={defaultStyle}>
      {title}
    </button>
  );
};

export default Button;

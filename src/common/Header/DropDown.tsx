const DropDown = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="bg-gray-100 w-[80%] lg:w-[85%] xl:w-[90%] h-full rounded-r-4xl md:block hidden"
      style={{ boxShadow: "1px 0 12px 0 rgba(0,0,0,0.4)" }}
    >
      {children}
    </div>
  );
};

export default DropDown;

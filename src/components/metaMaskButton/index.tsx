import React from "react";

type MetaMaskButtonProps = {
  onClick: () => void;
};

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({ onClick }) => {
  const handleClick = function (): void {
    onClick();
  };

  return (
    <button
      className="w-48 h-14 bg-white shadow-md items-center rounded-full fixed bottom-4 justify-around right-8  px-4 hidden md:flex"
      onClick={() => handleClick()}
      onKeyDown={() => handleClick()}
      tabIndex={0}
      type="button"
    >
      <img src="/icons/metamask_icon.svg" width={30} height={30} />
    </button>
  );
};

export default MetaMaskButton;

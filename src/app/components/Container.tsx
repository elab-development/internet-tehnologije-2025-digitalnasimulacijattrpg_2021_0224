'use client'

interface ContainerProps {
  name: string;
  onClick: () => void;
  id:number;
}

function Container({ name, onClick }: ContainerProps) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
         border-[15px] border-white-400 bg-[#6d6d6d]
        hover:text-pink-500
        w-[90%]
        m-3
      "
      style={{borderStyle : 'inset'}}

    >
      <h3 className="
      text-shadow-custom
      text-[#ffff0]
      hover:text-pink
      font-bold
      text-4xl">{name}</h3>
    </div>
  );
}

export default Container;

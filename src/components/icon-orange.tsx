import Image from 'next/image';

const IconOrange = () => {
  return (
    <Image
      src={'/icon-orange.svg'}
      width={50}
      height={50}
      alt="Societiza Icon"
      priority={true}
    />
  );
};

export default IconOrange;

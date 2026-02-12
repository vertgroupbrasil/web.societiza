import Image from 'next/image';

const Icon = () => {
  return (
    <Image
      src={'/icon.svg'}
      width={50}
      height={50}
      alt="Flowtec Icon"
      priority={true}
    />
  );
};

export default Icon;

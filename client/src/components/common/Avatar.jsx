import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const bg = getAvatarColor(name);
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}
      style={{ backgroundColor: bg }} title={name}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

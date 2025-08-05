import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const Avatar = ({
    user,
    size = 'md',
    className = '',
    showOnlineStatus = false,
    fallbackType = 'initials' // 'initials', 'icon', or 'generated'
}) => {
    const sizeClasses = {
        'xs': 'h-6 w-6',
        'sm': 'h-8 w-8',
        'md': 'h-10 w-10',
        'lg': 'h-16 w-16',
        'xl': 'h-24 w-24',
        '2xl': 'h-32 w-32'
    };

    const iconSizes = {
        'xs': 'h-3 w-3',
        'sm': 'h-4 w-4',
        'md': 'h-6 w-6',
        'lg': 'h-8 w-8',
        'xl': 'h-12 w-12',
        '2xl': 'h-16 w-16'
    };

    const textSizes = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-xl',
        'xl': 'text-3xl',
        '2xl': 'text-4xl'
    };

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate color based on name
    const getColorFromName = (name) => {
        if (!name) return 'bg-gray-500';

        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    // Generate avatar URL for external service
    const getGeneratedAvatarUrl = (name, size) => {
        if (!name) return null;
        const encodedName = encodeURIComponent(name);
        const dimension = size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 64 : size === 'xl' ? 96 : 128;
        return `https://ui-avatars.com/api/?name=${encodedName}&size=${dimension}&background=random&color=fff&font-size=0.33&rounded=true`;
    };

    const renderFallback = () => {
        switch (fallbackType) {
            case 'initials':
                return (
                    <div className={`${sizeClasses[size]} rounded-full ${getColorFromName(user?.name)} flex items-center justify-center text-white font-semibold ${textSizes[size]}`}>
                        {getInitials(user?.name)}
                    </div>
                );
            case 'generated':
                return (
                    <img
                        src={getGeneratedAvatarUrl(user?.name, size)}
                        alt={user?.name || 'User'}
                        className={`${sizeClasses[size]} rounded-full object-cover`}
                        onError={(e) => {
                            // Fallback to initials if external service fails
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                            }
                        }}
                    />
                );
            case 'icon':
            default:
                return (
                    <div className={`${sizeClasses[size]} rounded-full bg-indigo-100 flex items-center justify-center`}>
                        <UserIcon className={`${iconSizes[size]} text-indigo-600`} />
                    </div>
                );
        }
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}>
                {user?.image_path ? (
                    <>
                        <img
                            src={`/storage/${user.image_path}`}
                            alt={user.name || 'User'}
                            className={`${sizeClasses[size]} object-cover rounded-full`}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'flex';
                                }
                            }}
                        />
                        <div style={{ display: 'none' }}>
                            {renderFallback()}
                        </div>
                    </>
                ) : (
                    renderFallback()
                )}
            </div>

            {showOnlineStatus && (
                <div className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></div>
            )}
        </div>
    );
};

export default Avatar;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ excludePaths = [] }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Kiểm tra xem pathname hiện tại có trong danh sách loại trừ không
        const shouldScroll = !excludePaths.some(path => pathname.includes(path));
        
        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }, [pathname, excludePaths]);

    return null;
};

export default ScrollToTop;

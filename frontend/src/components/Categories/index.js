import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import '../../styles/components/_categories.scss';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const data = await categoryService.getAllCategories();
            console.log('Categories data:', data);
            setCategories(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
            setError('Không thể tải danh mục sản phẩm');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!categories.length) return <div className="no-data">Không có danh mục nào</div>;

    return (
        <div className="categories-container">
            <h2>Danh Mục Sản Phẩm</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <img 
                            src={category.image} 
                            alt={category.name}
                            onError={(e) => {
                                console.log('Image load error:', category.image);
                                e.target.onerror = null;
                                e.target.src = '/images/default.png';
                            }}
                        />
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;

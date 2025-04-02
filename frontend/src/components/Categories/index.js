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
            const data = await categoryService.getAllCategories();
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError('Không thể tải danh mục sản phẩm');
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="categories-container">
            <h2>Danh Mục Sản Phẩm</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <img src={category.image} alt={category.name} />
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;

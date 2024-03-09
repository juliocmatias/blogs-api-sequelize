module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    tableName: 'posts_categories',
    timestamps: false,
    underscored: true
  });

  PostCategory.associate = ({ BlogPost, Category }) => {
    BlogPost.belongsToMany(Category, {
      through: PostCategory,
      foreignKey: 'postID',
      otherKey: 'categoryID',
      as: 'categories',
    });
    Category.belongsToMany(BlogPost, {
      through: PostCategory,
      foreignKey: 'categoryID',
      otherKey: 'postID',
      as: 'posts',
    });
  };

  return PostCategory;
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('blog_posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
        primaryKey: true
      },
      published: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now')
      },
      updated: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now')
      }
    })
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('blog_posts');
  }
};

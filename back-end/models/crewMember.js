module.exports = (sequelize, DataTypes) => {
    const CrewMember = sequelize.define('crewMember', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: DataTypes.STRING,
        role:DataTypes.STRING,
        movieId:DataTypes.INTEGER
    });

    CrewMember.associate = models => {
        CrewMember.belongsTo(models.movie, {
            as: 'crewMember',
            foreignKey: "movieId"
        });

    }

    return CrewMember;
}
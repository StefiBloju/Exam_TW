module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('movie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: DataTypes.STRING,
        category: DataTypes.STRING,
        publicationDate:DataTypes.STRING
    });

    Movie.associate = models => {
        Movie.hasMany(models.crewMember, {
            onDelete: "cascade"
        });
    }
    return Movie;

}
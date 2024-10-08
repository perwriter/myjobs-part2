import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';

class Profile extends Model {
  public id!: number;
  public user_id!: number;
  public about_me!: string;
  public industrial_field!: string;
  public preferred_locations!: string;
  public preferred_job_titles!: string;
  public race!: string;
  public resume_path!: string;
  public coverletter_path!: string;
  public salary_expectations!: string;
  public work_environment_preference!: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    about_me: DataTypes.TEXT,
    industrial_field: DataTypes.STRING,
    preferred_locations: DataTypes.STRING,
    preferred_job_titles: DataTypes.STRING,
    race: DataTypes.STRING(100),
    resume_path: DataTypes.STRING,
    coverletter_path: DataTypes.STRING,
    salary_expectations: DataTypes.STRING(100),
    work_environment_preference: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: false,
  }
);

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

export default Profile;
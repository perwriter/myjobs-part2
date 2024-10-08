import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';

class JobApplication extends Model {
  public id!: number;
  public user_id!: number;
  public date_applied!: Date;
  public company!: string;
  public job_title!: string;
  public source!: string;
  public job_link!: string;
  public job_type!: string;
  public salary_range!: string;
  public location!: string;
  public deadline!: Date;
  public job_description!: string;
  public cv_used!: string;
  public cover_letter!: string;
  public status!: string;
  public status_history!: string;
  public points_to_note!: string;
}

JobApplication.init(
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
    date_applied: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: DataTypes.STRING,
    job_link: DataTypes.STRING,
    job_type: DataTypes.STRING(100),
    salary_range: DataTypes.STRING(100),
    location: DataTypes.STRING,
    deadline: DataTypes.DATE,
    job_description: DataTypes.TEXT,
    cv_used: DataTypes.STRING,
    cover_letter: DataTypes.STRING,
    status: DataTypes.STRING(100),
    status_history: DataTypes.TEXT,
    points_to_note: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'JobApplication',
    tableName: 'job_applications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.hasMany(JobApplication, { foreignKey: 'user_id' });
JobApplication.belongsTo(User, { foreignKey: 'user_id' });

export default JobApplication;
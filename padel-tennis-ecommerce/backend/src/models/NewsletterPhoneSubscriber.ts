import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface NewsletterPhoneSubscriberAttributes {
  id: number;
  phone: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

class NewsletterPhoneSubscriber extends Model<NewsletterPhoneSubscriberAttributes> implements NewsletterPhoneSubscriberAttributes {
  public id!: number;
  public phone!: string;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

NewsletterPhoneSubscriber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [10, 20], // Mínimo 10 dígitos, máximo 20
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'newsletter_phone_subscribers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default NewsletterPhoneSubscriber; 
import { Sequelize, DataTypes } from 'sequelize'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve();
const dbFolder = path.resolve(__dirname, 'data');

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/blog.sqlite'
});

const Article:any = sequelize.define('Article', 
    {
        id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        website: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        categories: { type: DataTypes.JSON, allowNull: false },
        files: { type: DataTypes.JSON, allowNull: false }
    },
    {
        tableName: 'articles',
        timestamps: true,
    }
);

const ExportQueue:any = sequelize.define('Export_queue', 
    {
        id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        url: { type: DataTypes.STRING, allowNull: false },
        emails: { type: DataTypes.JSON, allowNull: true }
    },
    {
        tableName: 'export_queue',
        timestamps: true,
    }
);

// Sync the models with the database
sequelize.sync()
    .then(() => {
        console.log('Database and tables created successfully');
    })
    .catch((error: any) => {
        console.error('Error creating database tables:', error);
    });

export { sequelize, Article, ExportQueue }

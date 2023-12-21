import { Sequelize, DataTypes } from 'sequelize'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve();
const dbFolder = path.resolve(__dirname, 'data');
const dbFile = path.resolve(dbFolder, 'blog.sqlite');

let dbInitiated = false;

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile
});

const Article:any = sequelize.define('Article', 
    {
        id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        website: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        categories: { type: DataTypes.STRING, allowNull: false },
        files: { type: DataTypes.STRING, allowNull: false }
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
        emails: { type: DataTypes.STRING, allowNull: true }
    },
    {
        tableName: 'export_queue',
        timestamps: true,
    }
);

const DbInit = async () => {
    try {
        if (!dbInitiated) {
            sequelize.sync()
                .then(() => {
                    console.log('Database and tables created successfully');
                })
                .catch((error: any) => {
                    console.error('Error creating database tables:', error);
                });
            dbInitiated = true;
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export { sequelize, Article, ExportQueue, DbInit };

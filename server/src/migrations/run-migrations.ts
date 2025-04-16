import { AppDataSource } from "../config/data-source";


AppDataSource.initialize()
    .then(() => {
        AppDataSource.runMigrations()
            .then(() => {
                console.log('Migrations run successfully');
                AppDataSource.destroy();
            })
            .catch(error => {
                console.error('Error running migrations', error);
                AppDataSource.destroy();
            });
    })
    .catch(error => {
        console.error('Error during Data Source initialization', error);
    });

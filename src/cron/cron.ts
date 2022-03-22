import { CronJob } from "cron";
import { config } from "../bin/config";

const cron = new CronJob(config.cronJobExpression, () => {
    console.log("Cron jobs are ready to be scheudled and are set to run once every hour");
});

export { cron };
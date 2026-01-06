import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { MatchesModule } from './matches/matches.module';
import { MatchRecordsModule } from './match_records/match_records.module';
import { ExpensesModule } from './expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchDatesModule } from './match-dates/match-dates.module';
import { Players } from './players/entities/player.entity';
import { Matches } from './matches/entities/match.entity';
import { Expenses } from './expenses/entities/expense.entity';
import { MatchRecords } from './match_records/entities/match_record.entity';
import { MatchDates } from './match-dates/entities/match-date.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      entities: [Players, Matches, MatchRecords, MatchDates, Expenses],
    }),

    PlayersModule,
    MatchesModule,
    MatchRecordsModule,
    ExpensesModule,
    MatchDatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

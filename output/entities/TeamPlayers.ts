import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Players } from "./Players";
import { Teams } from "./Teams";

@Index("team_players_pkey", ["id"], { unique: true })
@Index("team_players_team_id_player_id_key", ["playerId", "teamId"], {
  unique: true,
})
@Entity("team_players", { schema: "public" })
export class TeamPlayers {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "team_id", unique: true })
  teamId: number;

  @Column("integer", { name: "player_id", unique: true })
  playerId: number;

  @Column("date", { name: "joined_at", nullable: true })
  joinedAt: string | null;

  @Column("date", { name: "left_at", nullable: true })
  leftAt: string | null;

  @ManyToOne(() => Players, (players) => players.teamPlayers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "player_id", referencedColumnName: "id" }])
  player: Players;

  @ManyToOne(() => Teams, (teams) => teams.teamPlayers, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "team_id", referencedColumnName: "id" }])
  team: Teams;
}

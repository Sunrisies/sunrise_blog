import { BaseEntity, Column, Entity, Index, OneToMany } from "typeorm";
import { TeamUser } from "./TeamUser";

@Index("user_user_id_key", ["userId"], { unique: true })
@Index("user_pkey", ["userId"], { unique: true })
@Index("user_username_key", ["username"], { unique: true })
@Entity("user", { schema: "public" })
export class User extends BaseEntity {
  @Column("uuid", { primary: true, name: "user_id" })
  userId: string;

  @Column("character varying", { name: "username", length: 255 })
  username: string;

  @Column("character varying", { name: "password", length: 60 })
  password: string;

  @Column("character varying", { name: "role", length: 50 })
  role: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp with time zone", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("character varying", {
    name: "display_name",
    nullable: true,
    length: 255,
  })
  displayName: string | null;

  @Column("character varying", {
    name: "logo_url",
    nullable: true,
    length: 2183,
  })
  logoUrl: string | null;

  @OneToMany(() => TeamUser, teamUser => teamUser.user)
  teamUsers: TeamUser[];
}

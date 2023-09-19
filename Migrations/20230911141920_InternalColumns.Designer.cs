﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using wedding.Data;

#nullable disable

namespace wedding.Migrations
{
    [DbContext(typeof(ContextWedding))]
    [Migration("20230911141920_InternalColumns")]
    partial class InternalColumns
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("wedding.Data.WeddingGifts", b =>
                {
                    b.Property<Guid>("GroupId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("group_id");

                    b.Property<float?>("GiftAmount")
                        .HasColumnType("real")
                        .HasColumnName("gift_amount");

                    b.Property<string>("GiftComment")
                        .HasColumnType("text")
                        .HasColumnName("gift_comment");

                    b.Property<DateTime?>("GiftDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("gift_date");

                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.HasKey("GroupId");

                    b.ToTable("wedding_gifts");
                });

            modelBuilder.Entity("wedding.Data.WeddingGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool?>("AdminFlag")
                        .HasColumnType("boolean")
                        .HasColumnName("admin_flag");

                    b.Property<bool?>("AirlineFlag")
                        .HasColumnType("boolean")
                        .HasColumnName("airline_flag");

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("email_address");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uuid")
                        .HasColumnName("group_id");

                    b.Property<DateTime?>("LastLoginDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_login_date");

                    b.HasKey("Id");

                    b.ToTable("wedding_group");
                });

            modelBuilder.Entity("wedding.Data.WeddingGroupName", b =>
                {
                    b.Property<Guid>("GroupId")
                        .HasColumnType("uuid")
                        .HasColumnName("group_id");

                    b.Property<int>("GroupMemberId")
                        .HasColumnType("integer")
                        .HasColumnName("group_member_id");

                    b.Property<bool?>("ConditionalRsvpYes")
                        .HasColumnType("boolean")
                        .HasColumnName("conditional_rsvp_yes");

                    b.Property<int?>("DrinkTypeCd")
                        .HasColumnType("integer")
                        .HasColumnName("drink_type_cd");

                    b.Property<string>("GroupMemberName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("group_member_name");

                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("RsvpComment")
                        .HasColumnType("text")
                        .HasColumnName("rsvp_comment");

                    b.Property<bool?>("RsvpYes")
                        .HasColumnType("boolean")
                        .HasColumnName("rsvp_yes");

                    b.HasKey("GroupId", "GroupMemberId");

                    b.ToTable("wedding_group_name");
                });

            modelBuilder.Entity("wedding.Data.WeddingGroupName", b =>
                {
                    b.HasOne("wedding.Data.WeddingGroup", "WeddingGroup")
                        .WithMany("WeddingGroupNames")
                        .HasForeignKey("GroupId")
                        .HasPrincipalKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("WeddingGroup");
                });

            modelBuilder.Entity("wedding.Data.WeddingGroup", b =>
                {
                    b.Navigation("WeddingGroupNames");
                });
#pragma warning restore 612, 618
        }
    }
}

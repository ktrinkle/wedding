using System.Text.RegularExpressions;

namespace wedding.Data;
public partial class ContextWedding : DbContext
{
    public ContextWedding() { }

    public ContextWedding(DbContextOptions<ContextWedding> options)
        : base(options) { }

    public virtual DbSet<WeddingGroup> WeddingGroup { get; set; } = null!;
    public virtual DbSet<WeddingGroupName> WeddingGroupName { get; set; } = null!;
    public virtual DbSet<WeddingGifts> WeddingGifts { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //automatically convert camel case to DB column names

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            //Loop through all the columns and convert from CamelCase to database_case
            //DO NOT MODIFY THIS CODE!
            foreach (var prop in entity.GetProperties())
            {
                prop.SetColumnName(Regex.Replace(prop.Name, "(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])", "_$1").ToLower());
            }
        }

        modelBuilder.Entity<WeddingGroup>()
                .HasMany(e => e.WeddingGroupNames)
                .WithOne(e => e.WeddingGroup)
                .HasForeignKey(e => e.GroupId)
                .HasPrincipalKey(e => e.GroupId);
        
        modelBuilder.Entity<WeddingGroupName>(entity => entity.HasKey(k => new { k.GroupId, k.GroupMemberId }));

        modelBuilder.Entity<WeddingGifts>()
                .HasKey(e => e.GroupId);
        
    }
}

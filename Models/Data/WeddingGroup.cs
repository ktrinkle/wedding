using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

[Table("wedding_group")]
public partial class WeddingGroup
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public Guid GroupId { get; set; }
    public string EmailAddress { get; set; } = String.Empty;
    public DateTime? LastLoginDate { get; set; }
    public bool? AdminFlag { get; set; }
    public bool? AirlineFlag { get; set; }

    public ICollection<WeddingGroupName> WeddingGroupNames { get; set; } = null!;
}

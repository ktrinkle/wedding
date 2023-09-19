using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

[Table("wedding_group_name")]
public partial class WeddingGroupName
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public Guid GroupId { get; set; }
    public int GroupMemberId { get; set; }
    public string GroupMemberName { get; set; } = String.Empty;
    public bool? RsvpYes { get; set; }
    public string? RsvpComment { get; set; }
    public int? DrinkTypeCd { get; set; }
    public bool? ConditionalRsvpYes { get; set; }

    public WeddingGroup WeddingGroup { get; set; } = null!;
}

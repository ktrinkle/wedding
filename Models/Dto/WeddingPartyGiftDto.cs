using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

public partial class WeddingPartyGiftDto
{
    public string GroupId { get; set; } = String.Empty;
    public string FirstGroupMemberName { get; set; } = String.Empty;
    public bool? RsvpYes { get; set; }
    public string? GiftComment { get; set; }
    public float? GiftAmount { get; set; }
    public DateTime? GiftDate { get; set; }
}

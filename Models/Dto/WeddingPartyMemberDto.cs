using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

public partial class WeddingPartyMemberDto
{
    public int GroupMemberId { get; set; }
    public string GroupMemberName { get; set; } = String.Empty;
    public bool? RsvpYes { get; set; }
    public string? RsvpComment { get; set; }
}

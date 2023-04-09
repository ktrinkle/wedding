using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

public partial class WeddingPartyDto
{
    public Guid GroupId { get; set; }
    public string EmailAddress { get; set; } = String.Empty;
    public List<WeddingPartyMemberDto>? PartyMembers { get; set; }
}

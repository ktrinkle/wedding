using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

public partial class WeddingPartyMemberDto
{
    public Guid GroupId { get; set; }
    public int GroupMemberId { get; set; }
    public string GroupMemberName { get; set; } = String.Empty;
    public string? RsvpComment { get; set; }
    public bool? RsvpYes { get; set; }
    public int? RsvpDrinkType { get; set; }
    public RsvpDrinkType? RsvpDrinkTypeText { get; set; }
}

public enum RsvpDrinkType
{
    NonAlcoholic,
    Mocktail,
    Alcoholic
}

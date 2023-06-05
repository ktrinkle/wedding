using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace wedding.Data;

[Table("wedding_gifts")]
public partial class WeddingGifts
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public Guid GroupId { get; set; }
    public DateTime? GiftDate { get; set; }
    public float? GiftAmount { get; set; }
    public string? GiftComment { get; set; }

}

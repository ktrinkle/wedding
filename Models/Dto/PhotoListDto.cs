namespace Wedding.Models;

public class PhotoListDto
{
    public Guid PhotoGuid { get; set; }
    public byte[]? PhotoPreview { get; set; }
    public string? PhotoType { get; set; }
}
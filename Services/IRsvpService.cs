namespace wedding.Services;

public interface IRsvpService
{
    Task<WeddingPartyDto> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto updateDto);
}


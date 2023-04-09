using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace wedding.Models;

public class JWTDto
{
    public string? PartyEmail { get; set; }
    public Guid? PartyGuid { get; set; }
    public string Role { get; set; } = String.Empty;
}


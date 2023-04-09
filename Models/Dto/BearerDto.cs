using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace wedding.Models;

public class BearerDto
{
    public string? PartyGuid { get; set; }
    public string? PartyAddress { get; set; }
    public string? BearerToken { get; set; }
}


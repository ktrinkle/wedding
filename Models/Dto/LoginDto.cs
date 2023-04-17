using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace wedding.Models;

public class LoginDto
{
    public string? EmailAddress { get; set; }
    public string? Password { get; set; }
}


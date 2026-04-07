package com.example.hellborn_backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class LoginRequestDTO {

    private String email;
    private String password;
}

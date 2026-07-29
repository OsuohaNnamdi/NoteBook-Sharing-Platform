package com.LASU.project.DTO;


import com.LASU.project.Entity.Enum.AccountType;

public record ProfileDTO(

        Long id,
        String fullName,
        String email,
        String schoolId,
        AccountType accountType

) {
}

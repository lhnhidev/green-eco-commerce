# GreenEcoCommerce.Domain.UnitTests

Pure unit tests for the **Domain Layer** of the GreenEcoCommerce Clean Architecture backend.

## Overview

| Attribute        | Value                             |
|-----------------|-----------------------------------|
| **Test Type**   | Unit Tests                        |
| **Framework**   | xUnit v3                          |
| **Tools**       | xUnit only (no mocks, no I/O)     |
| **Target Layer**| `GreenEcoCommerce.Domain`         |
| **Coverage**    | Value Objects, Entities           |

> [!NOTE]
> Domain tests are the fastest tests. They require **no external dependencies**, no database, no network, and no mocks. They test pure C# logic in isolation.

---

## Test File Structure

```
GreenEcoCommerce.Domain.UnitTests/
├── ValueObjects/
│   ├── EmailTests.cs
│   └── PhoneNumberTests.cs
├── Entities/
│   ├── CategoryTests.cs
│   └── UserTests.cs
└── README.md
```

---

## ValueObjects/EmailTests.cs

Tests for the `Email` value object (`GreenEcoCommerce.Domain.ValueObjects.Email`).

The `Email` class:
- Validates format using regex `^[^@\s]+@[^@\s]+\.[^@\s]+$` (case-insensitive)
- Trims whitespace before validation
- Throws `InvalidEmailException` for invalid or empty input
- Implements case-insensitive equality

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Create_WithValidEmail_ShouldSucceed` | `test@email.com`, `user@domain.org`, `admin@green-eco.vn` | `Email` object created |
| `Create_WithEmpty_ShouldThrowInvalidEmailException` | Empty string `""` | `InvalidEmailException` |
| `Create_WithWhitespaceOnly_ShouldThrowInvalidEmailException` | `"   "` | `InvalidEmailException` |
| `Create_WithNull_ShouldThrowInvalidEmailException` | `null` | `InvalidEmailException` |
| `Create_WithInvalidFormat_ShouldThrowInvalidEmailException` | `"notanemail"`, `"@nodomain"`, `"noatsign.com"`, `"spaces @here.com"` | `InvalidEmailException` |
| `Create_ShouldTrimWhitespace` | `"  test@email.com  "` | Email with trimmed value |
| `ImplicitOperator_ShouldConvertToString` | Valid email object | `string` value |
| `Equals_SameCaseEmails_ShouldBeEqual` | `"test@email.com"` vs `"test@email.com"` | `true` |
| `Equals_DifferentCaseEmails_ShouldBeEqual` | `"Test@Email.COM"` vs `"test@email.com"` | `true` (case-insensitive) |
| `Equals_DifferentEmails_ShouldNotBeEqual` | `"a@b.com"` vs `"c@d.com"` | `false` |
| `GetHashCode_SameEmailDifferentCase_ShouldBeEqual` | Same email, different casing | Same hash code |
| `ToString_ShouldReturnValue` | Valid email | Returns `Value` string |

---

## ValueObjects/PhoneNumberTests.cs

Tests for the `PhoneNumber` value object (`GreenEcoCommerce.Domain.ValueObjects.PhoneNumber`).

The `PhoneNumber` class:
- Validates Vietnamese mobile numbers using regex `^(0[3|5|7|8|9])+([0-8]{8})\b$`
- Strips internal whitespace before validation
- Throws `InvalidPhoneNumberException` for invalid input
- Valid prefixes: `03x`, `05x`, `07x`, `08x`, `09x`

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Create_WithValidVietnamesePhone_ShouldSucceed` | `0311111110`, `0511111110`, `0711111110`, `0811111110`, `0911111110` | `PhoneNumber` created |
| `Create_WithEmpty_ShouldThrowInvalidPhoneNumberException` | `""` | `InvalidPhoneNumberException` |
| `Create_WithWhitespace_ShouldThrowInvalidPhoneNumberException` | `"   "` | `InvalidPhoneNumberException` |
| `Create_WithInvalidPrefix_ShouldThrowInvalidPhoneNumberException` | `0111111110`, `0211111110`, `0411111110`, `0611111110` | `InvalidPhoneNumberException` |
| `Create_WithWrongLength_ShouldThrowInvalidPhoneNumberException` | `031111111` (9 digits), `03111111100` (11 digits) | `InvalidPhoneNumberException` |
| `Create_WithPhoneHavingSpaces_ShouldStripSpacesAndSucceed` | `"031 1111 110"` | `PhoneNumber` created, spaces stripped |
| `ImplicitOperator_ShouldConvertToString` | Valid phone object | `string` value |
| `Equals_SamePhoneNumbers_ShouldBeEqual` | Same phone string | `true` |
| `Equals_DifferentPhoneNumbers_ShouldNotBeEqual` | Different phones | `false` |

---

## Entities/CategoryTests.cs

Tests for the `Category` entity (`GreenEcoCommerce.Domain.Entities.Category`).

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Category_DefaultConstructor_ShouldInitializeId` | New `Category` | `Id != Guid.Empty` |
| `Category_DefaultConstructor_ShouldInitializeEmptyChildCategories` | New `Category` | `ChildCategories` is not null, empty |
| `Category_DefaultConstructor_ShouldInitializeEmptyProducts` | New `Category` | `Products` is not null, empty |
| `Category_Id_ShouldBeUniquePerInstance` | Two `new Category()` | Different GUIDs |
| `Category_Name_ShouldAcceptValidValue` | `Name = "Electronics"` | Property set |
| `Category_Description_ShouldBeNullByDefault` | No description set | `null` |
| `Category_ParentId_ShouldBeNullByDefault` | No parent set | `null` |
| `Category_CanSetParentId` | `ParentId = someGuid` | Property set |
| `Category_CanHaveChildCategories` | Add child to `ChildCategories` | Count = 1 |

---

## Entities/UserTests.cs

Tests for the `User` entity constructor (`GreenEcoCommerce.Domain.Entities.User`).

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Constructor_ShouldSetAllPropertiesCorrectly` | Valid args | All properties match |
| `Constructor_WithNullRole_ShouldDefaultToUserRole` | `role = null` | `Role == RoleEnum.User` |
| `Constructor_WithAdminRole_ShouldSetAdminRole` | `role = RoleEnum.Admin` | `Role == RoleEnum.Admin` |
| `Constructor_ShouldSetFullNameAsLastNameSpaceFirstName` | `firstName="John"`, `lastName="Doe"` | `FullName == "Doe John"` |
| `Id_ShouldBeNonEmpty` | New `User` | `Id != Guid.Empty` |
| `Id_ShouldBeUniquePerInstance` | Two `User` instances | Different GUIDs |

---

## How to Run

```bash
# Run Domain tests only
dotnet test tests/GreenEcoCommerce.Domain.UnitTests/

# Run with verbose output
dotnet test tests/GreenEcoCommerce.Domain.UnitTests/ -v normal

# Run with coverage
dotnet test tests/GreenEcoCommerce.Domain.UnitTests/ --collect:"XPlat Code Coverage"
```

> [!TIP]
> These tests run in milliseconds. Run them frequently during development.

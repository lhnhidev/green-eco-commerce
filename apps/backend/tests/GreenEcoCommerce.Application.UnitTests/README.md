# GreenEcoCommerce.Application.UnitTests

Unit tests for the **Application Layer** of the GreenEcoCommerce Clean Architecture backend.

## Overview

| Attribute        | Value                                  |
|-----------------|----------------------------------------|
| **Test Type**   | Unit Tests                             |
| **Framework**   | xUnit v3 + Moq + FluentValidation      |
| **Tools**       | xUnit, Moq (mocking), FluentValidation |
| **Target Layer**| `GreenEcoCommerce.Application`         |
| **Coverage**    | CQRS Handlers, Validators, Pipeline    |

> [!NOTE]
> All external dependencies (repositories, JWT service) are **mocked using Moq**. These tests never touch a real database or network.

---

## Test File Structure

```
GreenEcoCommerce.Application.UnitTests/
├── Behaviors/
│   └── ValidationBehaviorTests.cs
├── Features/
│   ├── Auth/
│   │   ├── RegisterHandlerTests.cs
│   │   └── LoginHandlerTests.cs
│   └── Categories/
│       ├── GetAllCategoriesHandlerTests.cs
│       ├── GetCategoryByIdHandlerTests.cs
│       ├── CreateCategoryHandlerTests.cs
│       ├── UpdateCategoryHandlerTests.cs
│       └── DeleteCategoryHandlerTests.cs
├── Validators/
│   ├── CreateCategoryValidatorTests.cs
│   ├── UpdateCategoryCommandValidatorTests.cs
│   ├── DeleteCategoryCommandValidatorTests.cs
│   ├── RegisterCommandValidatorTests.cs
│   └── LoginCommandValidatorTests.cs
└── README.md
```

---

## Features/Categories — Handler Tests

### GetAllCategoriesHandlerTests.cs

Tests `GetAllCategoriesHandler` which calls `ICategoryRepository.GetAllAsync()` and maps the result.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ReturnsEmptyList_WhenNoCategoriesExist` | Repository returns `[]` | Empty `List<CategoryDto>` |
| `Handle_ReturnsMappedDtos_WhenCategoriesExist` | Repository returns 2 categories | List of 2 `CategoryDto` |
| `Handle_ShouldCallGetAllAsyncOnce` | Normal call | `GetAllAsync` called exactly once |
| `Handle_ShouldCallMapperOnce` | Normal call | `mapper.Map<List<CategoryDto>>` called once |

### GetCategoryByIdHandlerTests.cs

Tests `GetCategoryById` handler.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ReturnsCategoryDto_WhenCategoryExists` | Repository returns category | Mapped `CategoryDto` |
| `Handle_ThrowsNotFoundException_WhenCategoryDoesNotExist` | Repository returns `null` | `NotFoundException` |
| `Handle_ShouldCallGetByIdAsyncOnce` | Normal call | `GetByIdAsync` called once |

### CreateCategoryHandlerTests.cs

Tests `CreateCategoryHandler`.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ShouldAddCategoryAndReturnDto` | Valid payload | Returns `CategoryDto` |
| `Handle_ShouldCallAddAsyncOnce` | Normal call | `AddAsync` called once |
| `Handle_ShouldCallMapperTwice` | Normal call | Mapper called twice (payload → entity, entity → dto) |

### UpdateCategoryHandlerTests.cs

Tests `UpdateCategoryHandler`.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ShouldReturnUpdatedDto_WhenCategoryExists` | Repository returns `true` (updated) | Mapped `CategoryDto` |
| `Handle_ThrowsNotFoundException_WhenCategoryNotFound` | Repository returns `false` | `NotFoundException` with category ID |
| `Handle_ShouldCallUpdateAsyncOnce` | Normal call | `UpdateAsync` called once |

### DeleteCategoryHandlerTests.cs

Tests `DeleteCategoryHandler`.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ShouldCallDeleteAsync_AndReturnUnit` | Valid ID | Returns `Unit.Value` |
| `Handle_ShouldCallDeleteAsyncOnce` | Normal call | `DeleteAsync` called exactly once |

---

## Features/Auth — Handler Tests

### RegisterHandlerTests.cs

Tests `RegisterHandler` which checks for duplicate email/phone before creating a user.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ShouldReturnGuid_WhenCommandIsValid` | New email + phone | Returns `Guid` |
| `Handle_ThrowsBadRequestException_WhenEmailAlreadyExists` | `EmailUserExist` returns `true` | `BadRequestException("Email was exist")` |
| `Handle_ThrowsBadRequestException_WhenPhoneAlreadyExists` | `PhoneNumberUserExist` returns `true` | `BadRequestException("Phone was exist")` |
| `Handle_ShouldCallAddUserAsync_WhenNewUser` | Unique user | `AddUserAsync` called once |
| `Handle_ShouldCheckEmailBeforePhone` | Email duplicate | Does NOT check phone (email check fails first) |

### LoginHandlerTests.cs

Tests `LoginHandler` which verifies credentials with BCrypt and generates JWT.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `Handle_ShouldReturnToken_WhenCredentialsAreValid` | Correct email + password | JWT token string |
| `Handle_ThrowsNotFoundException_WhenUserNotFound` | Email not in DB | `NotFoundException` |
| `Handle_ThrowsNotFoundException_WhenPasswordIsWrong` | Correct email, wrong password | `NotFoundException` |
| `Handle_ShouldCallGetUserByEmailAsync` | Any login attempt | `GetUserByEmailAsync` called once |
| `Handle_ShouldCallGenerateToken_WhenLoginSucceeds` | Valid credentials | `IJwtService.GenerateToken` called once |

---

## Validators — Validation Tests

### CreateCategoryValidatorTests.cs

Tests `CreateCategoryValidator` (validates `CategoryPayloadDto`).

| Test Name | Scenario | Valid? |
|-----------|----------|--------|
| `Validate_WithValidData_ShouldPass` | Name="Electronics", no desc | ✅ |
| `Validate_WithNameEmpty_ShouldFail` | `Name=""` | ❌ "Category name is required." |
| `Validate_WithNameTooShort_ShouldFail` | `Name="A"` (1 char) | ❌ "Category name must be at least 2 characters long." |
| `Validate_WithNameTooLong_ShouldFail` | Name = 101 chars | ❌ "Category name must not exceed 100 characters." |
| `Validate_WithDescriptionTooLong_ShouldFail` | Description = 501 chars | ❌ "Description must not exceed 500 characters." |
| `Validate_WithNullDescription_ShouldPass` | `Description=null` | ✅ |
| `Validate_WithEmptyDescription_ShouldPass` | `Description=""` | ✅ |
| `Validate_WithNullParentId_ShouldPass` | `ParentId=null` | ✅ |
| `Validate_WithValidParentId_ShouldPass` | `ParentId=Guid.NewGuid()` | ✅ |

### UpdateCategoryCommandValidatorTests.cs

Tests `UpdateCategoryCommandValidator`.

| Test Name | Scenario | Valid? |
|-----------|----------|--------|
| `Validate_WithValidCommand_ShouldPass` | Valid Id + valid Name | ✅ |
| `Validate_WithEmptyId_ShouldFail` | `Id=Guid.Empty` | ❌ "Category ID must be a valid GUID." |
| `Validate_WithEmptyName_ShouldFail` | `Dto.Name=""` | ❌ |
| `Validate_WithNameTooShort_ShouldFail` | `Dto.Name="A"` | ❌ |
| `Validate_WithNameTooLong_ShouldFail` | Name = 101 chars | ❌ |
| `Validate_WithDescriptionTooLong_ShouldFail` | Desc = 501 chars | ❌ |

### DeleteCategoryCommandValidatorTests.cs

| Test Name | Scenario | Valid? |
|-----------|----------|--------|
| `Validate_WithValidId_ShouldPass` | `Id=Guid.NewGuid()` | ✅ |
| `Validate_WithEmptyGuid_ShouldFail` | `Id=Guid.Empty` | ❌ "Category ID must be a valid GUID." |

### RegisterCommandValidatorTests.cs

Tests `RegisterCommandValidator` for all fields.

| Field | Scenario | Expected |
|-------|----------|----------|
| `FirstName` | Empty | ❌ "First name is required." |
| `FirstName` | 1 char | ❌ "at least 2 characters" |
| `FirstName` | 81 chars | ❌ "not exceed 80 characters" |
| `LastName` | Empty | ❌ "Last name is required." |
| `LastName` | 1 char | ❌ "at least 2 characters" |
| `Phone` | Empty | ❌ "Phone number is required." |
| `Phone` | 9 digits | ❌ "exactly 10 digits" |
| `Phone` | 11 digits | ❌ "exactly 10 digits" |
| `Phone` | `"0211111110"` | ❌ "must be valid" (invalid prefix) |
| `Address` | Empty | ❌ "Address is required." |
| `Address` | 4 chars | ❌ "at least 5 characters" |
| `Address` | 501 chars | ❌ "not exceed 500 characters" |
| `Email` | Empty | ❌ "Email is required." |
| `Email` | `"notanemail"` | ❌ "valid email address" |
| `Password` | Empty | ❌ "Password is required." |
| `Password` | `"abc12"` | ❌ "at least 6 characters" |
| `Password` | `"alllowercase1"` | ❌ "at least one uppercase letter" |
| `Password` | `"ALLUPPERCASE1"` | ❌ "at least one lowercase letter" |
| `Password` | `"NoDigitHere"` | ❌ "at least one digit" |
| All valid | Valid command | ✅ |

### LoginCommandValidatorTests.cs

| Test Name | Scenario | Valid? |
|-----------|----------|--------|
| `Validate_WithValidData_ShouldPass` | Valid email + password | ✅ |
| `Validate_WithEmptyEmail_ShouldFail` | `Email=""` | ❌ "Email is required." |
| `Validate_WithInvalidEmail_ShouldFail` | `Email="bad"` | ❌ "valid email address" |
| `Validate_WithEmptyPassword_ShouldFail` | `Password=""` | ❌ "Password is required." |

---

## Behaviors/ValidationBehaviorTests.cs

Tests the MediatR `ValidationBehavior<TRequest, TResponse>` pipeline behavior.

| Test Name | Scenario | Expected |
|-----------|----------|----------|
| `ShouldCallNext_WhenNoValidatorsRegistered` | No validators injected | `next()` is called, returns result |
| `ShouldCallNext_WhenValidationPasses` | Validator returns no errors | `next()` is called |
| `ShouldThrowValidationException_WhenValidationFails` | Validator returns errors | `ValidationException` thrown |
| `ShouldGroupErrorsByPropertyName` | Multiple errors on same field | Errors grouped in dictionary |

---

## How to Run

```bash
# Run Application tests only
dotnet test tests/GreenEcoCommerce.Application.UnitTests/

# Run a specific test file
dotnet test tests/GreenEcoCommerce.Application.UnitTests/ --filter "FullyQualifiedName~RegisterHandlerTests"

# Run with coverage
dotnet test tests/GreenEcoCommerce.Application.UnitTests/ --collect:"XPlat Code Coverage"
```

> [!TIP]
> Use `--filter "FullyQualifiedName~ValidatorTests"` to run only validator tests.

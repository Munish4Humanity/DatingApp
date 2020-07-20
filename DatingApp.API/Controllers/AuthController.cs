using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(userForRegisterDto userForRegisterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();
            if (await _repo.UserExists(userForRegisterDto.UserName))
                return BadRequest("User already exists");

            var userToCreate = new User
            {
                UserName = userForRegisterDto.UserName
            };
            var CreatedUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
            return StatusCode(201);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginForDto userLoginForDto)
        {

            var useFromRepo = await _repo.Login(userLoginForDto.Username.ToLower(), userLoginForDto.Password);
            if (useFromRepo == null)
                return Unauthorized();

            var claims = new[]{
                        new Claim(ClaimTypes.NameIdentifier,useFromRepo.Id.ToString()),
                        new Claim(ClaimTypes.Name,useFromRepo.UserName)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });

        }
    }
}
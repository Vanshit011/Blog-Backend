import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../shared/constants/enum';
import { ForbiddenException } from '@nestjs/common';

const mockUserService = {
  findByGoogleId: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLogin', () => {
    const googleUser = {
      google_id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'pic',
      accessToken: 'token',
    };

    it('should throw ForbiddenException if user exists with different role', async () => {
      mockUserService.findByGoogleId.mockResolvedValue({
        id: 'user1',
        role: UserRole.USER,
      });

      await expect(
        service.googleLogin(googleUser, UserRole.ADMIN),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create user with required role if user does not exist', async () => {
      mockUserService.findByGoogleId.mockResolvedValue(null);
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      });
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.googleLogin(googleUser, UserRole.ADMIN);

      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.ADMIN }),
      );
      expect(result.access_token).toBe('jwt_token');
    });
  });
});
